
import urllib.request
import json
import sys

def run_sql(sql):
    url = 'http://localhost:5163'
    payload = {
        'jsonrpc': '2.0',
        'id': 1,
        'method': 'tools/call',
        'params': {
            'name': 'execute_sql',
            'arguments': {
                'project_id': 'vuiuorjzonpyobpelyld',
                'query': sql
            }
        }
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'content-type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            if 'error' in res:
                print(f"Error: {res['error']}")
            else:
                print("Success running SQL via MCP local proxy.")
    except Exception as e:
        print(f"Failed to call local MCP proxy: {e}")

sql = """
CREATE TABLE IF NOT EXISTS public.base_datos_historico_moldes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo text,
  codigo_molde text,
  defectos_a_reparar text,
  fecha_entrada date,
  fecha_esperada date,
  fecha_entrega date,
  estado text,
  observaciones text,
  usuario text,
  recibido text,
  created date DEFAULT CURRENT_DATE,
  responsable text,
  tipo_de_reparacion text,
  tipo text
);

ALTER TABLE public.base_datos_historico_moldes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.base_datos_historico_moldes FOR SELECT USING (true);
"""

if __name__ == "__main__":
    run_sql(sql)
