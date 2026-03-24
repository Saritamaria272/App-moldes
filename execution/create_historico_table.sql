
-- SQL to create the historical table requested by the user
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

-- Enable RLS and public access for reading (adjust as needed for security)
ALTER TABLE public.base_datos_historico_moldes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.base_datos_historico_moldes FOR SELECT USING (true);
