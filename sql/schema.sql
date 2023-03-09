CREATE TABLE public.departments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(64) NOT NULL UNIQUE,
  slug VARCHAR(64) NOT NULL UNIQUE,
  description VARCHAR(1000) DEFAULT '',
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  number VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(128) NOT NULL UNIQUE,
  units INTEGER NOT NULL,
  semester VARCHAR(64) NOT NULL,
  level VARCHAR(64),
  url VARCHAR(256),
  departments INTEGER NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT departments FOREIGN KEY (departments) REFERENCES departments (id) ON DELETE CASCADE
)
