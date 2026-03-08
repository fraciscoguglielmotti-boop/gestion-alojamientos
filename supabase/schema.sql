-- ============================================================
-- SCHEMA: Sistema de Gestión de Alojamientos Turísticos
-- ============================================================

-- Tabla de cabañas / unidades de alojamiento
CREATE TABLE cabanas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('cabana', 'hosteria', 'habitacion', 'suite')),
  capacidad INTEGER NOT NULL DEFAULT 2,
  precio_noche DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT UNIQUE,
  telefono TEXT,
  dni TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de reservas
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  cabana_id UUID NOT NULL REFERENCES cabanas(id) ON DELETE RESTRICT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  precio_total DECIMAL(10,2),
  notas TEXT,
  adultos INTEGER NOT NULL DEFAULT 2,
  ninos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fechas_validas CHECK (fecha_fin > fecha_inicio)
);

-- Tabla de automatizaciones WhatsApp
CREATE TABLE automatizaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('confirmacion', 'recordatorio', 'checkin', 'checkout', 'cancelacion', 'personalizado')),
  trigger_evento TEXT NOT NULL,
  trigger_horas INTEGER DEFAULT 0,
  mensaje_template TEXT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX idx_reservas_cabana ON reservas(cabana_id);
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_fechas ON reservas(fecha_inicio, fecha_fin);
CREATE INDEX idx_reservas_estado ON reservas(estado);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reservas_updated_at
  BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DATOS SEMILLA (seed)
-- ============================================================

INSERT INTO cabanas (nombre, tipo, capacidad, precio_noche, descripcion) VALUES
  ('Cabaña Pino', 'cabana', 4, 15000, 'Cabaña rodeada de pinos con vista al lago'),
  ('Cabaña Roble', 'cabana', 6, 20000, 'Cabaña grande con quincho y pileta'),
  ('Suite Montaña', 'suite', 2, 12000, 'Suite romántica con jacuzzi y vista a la montaña'),
  ('Habitación Río', 'habitacion', 2, 8000, 'Habitación doble con vista al río'),
  ('Cabaña Ciprés', 'cabana', 8, 28000, 'Cabaña premium para grupos grandes');

INSERT INTO clientes (nombre, apellido, email, telefono, dni) VALUES
  ('Martín', 'García', 'martin.garcia@email.com', '+54 9 11 1234-5678', '30123456'),
  ('Laura', 'Rodríguez', 'laura.rodriguez@email.com', '+54 9 351 2345-6789', '32456789'),
  ('Pablo', 'Sánchez', 'pablo.sanchez@email.com', '+54 9 261 3456-7890', '28789012'),
  ('Ana', 'Fernández', 'ana.fernandez@email.com', '+54 9 11 4567-8901', '35012345'),
  ('Carlos', 'López', 'carlos.lopez@email.com', '+54 9 381 5678-9012', '27345678');
