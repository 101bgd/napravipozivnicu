"""Read-only public checks through inherited network policy, preserving proxy and TLS."""
import concurrent.futures
import datetime
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

batch = Path(__file__).resolve().parent
metadata = json.loads((batch / 'metadata.json').read_text())

def check(design):
    url = 'https://napravipozivnicu.com/pozivnice/' + design['slug'] + '/'
    result = {'id': design['id'], 'url': url,
              'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'method': 'HTTPS GET via inherited proxy with TLS verification'}
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Robi-Publication-Check/1.0'})
        with urllib.request.urlopen(request, timeout=25) as response:
            body = response.read()
            result.update({'httpStatus': response.status, 'bytes': len(body),
                           'status': 'destination_response_received',
                           'destinationResponseReceived': True,
                           'publicEditorAndExport': 'NEPROVERENO'})
    except urllib.error.HTTPError as error:
        result.update({'status': 'failed_http_response', 'httpStatus': error.code,
                       'error': str(error), 'destinationResponseReceived': True,
                       'publicEditorAndExport': 'NEPROVERENO'})
    except Exception as error:
        message = str(error)
        result.update({'status': 'blocked', 'error': message,
                       'kind': 'proxy_connect_denial' if 'Tunnel connection failed: 403' in message else 'network_or_runtime_error',
                       'destinationResponseReceived': False,
                       'publicEditorAndExport': 'NEPROVERENO'})
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(check, metadata))
output = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'productionCommit': sys.argv[1], 'checks': results,
          'networkBypassUsed': False, 'proxyAndTlsPreserved': True,
          'interpretation': 'CONNECT403 is a proxy refusal before a destination response. '
                            'Repository deployment does not establish public editor/export or real AdSense success.'}
(batch / 'public-live-checks.json').write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps(output))
