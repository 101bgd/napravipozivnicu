// Local drafts and bounded, grouped history. No visitor data leaves this module.
export function createEditorState({ read, write, remove, status, historyChanged }) {
  let key, current, undo = [], redo = [], group = '', lastEdit = 0, timer, dirty = false, automatic = true;
  const historyStatus = () => historyChanged(undo.length > 0, redo.length > 0);
  function save(force = false) {
    clearTimeout(timer);
    if (!key || (!force && (!automatic || !dirty))) return;
    try { write(key, current); dirty = false; status('Sačuvano na ovom uređaju'); }
    catch { status('Čuvanje nije dostupno. Preuzmi pozivnicu da sačuvaš izmene.'); }
  }
  function schedule() {
    clearTimeout(timer);
    if (automatic) { status('Čuvam izmene…'); timer = setTimeout(() => save(), 450); }
    else status('Automatsko čuvanje je isključeno');
  }
  return {
    start(id, values) {
      save(); clearTimeout(timer); key = `invitation-${id}`; current = JSON.stringify(values);
      undo = []; redo = []; dirty = false; group = ''; lastEdit = 0;
      try { automatic = read('invitation-autosave') !== 'off'; } catch { automatic = true; }
      status(automatic ? 'Izmene se čuvaju samo na ovom uređaju' : 'Automatsko čuvanje je isključeno');
      historyStatus(); return automatic;
    },
    change(values, field = '') {
      const next = JSON.stringify(values); if (next === current) return;
      const time = Date.now();
      if (!field || field !== group || time - lastEdit > 700) { undo.push(current); if (undo.length > 40) undo.shift(); }
      current = next; redo = []; group = field; lastEdit = time; dirty = true;
      historyStatus(); schedule();
    },
    restore(forward = false) {
      const source = forward ? redo : undo, target = forward ? undo : redo;
      if (!source.length) return null;
      target.push(current); current = source.pop(); group = ''; dirty = true;
      historyStatus(); schedule(); return JSON.parse(current);
    },
    automatic(enabled) {
      automatic = enabled;
      try { write('invitation-autosave', enabled ? 'on' : 'off'); } catch { /* Draft saves report storage failures. */ }
      if (dirty) schedule();
      else { clearTimeout(timer); status(enabled ? 'Izmene se čuvaju samo na ovom uređaju' : 'Automatsko čuvanje je isključeno'); }
    },
    clear() {
      clearTimeout(timer);
      try { remove(key); this.automatic(false); dirty = false; status('Sačuvani nacrt je obrisan. Tekst je i dalje u editoru.'); return true; }
      catch { status('Pregledač ne dozvoljava brisanje nacrta.'); return false; }
    },
    save,
    finish() { save(); clearTimeout(timer); key = null; dirty = false; },
  };
}
