import { connectCirclesKuckir as kuckir } from './core/metaballs';
import * as Persist from './services/persist';
import * as Exporter from './services/export';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
w.Metaballs = w.Metaballs || {};
w.Metaballs.connectCirclesKuckir = kuckir;

w.Services = w.Services || {};
w.Services.Persist = Persist;
w.Services.Exporter = Exporter;

// Renderer bridge (exponer renderConnections y renderCircles)
import * as RendererConnections from './renderer/connections';
import * as RendererCircles from './renderer/circles';
w.Renderer = w.Renderer || {};
w.Renderer.renderConnections = RendererConnections.renderConnections;
w.Renderer.renderCircles = RendererCircles.renderCircles;

// Model bridge: export Circle class for legacy to instantiate
import { Circle } from './model/circle';
w.Model = w.Model || {};
w.Model.Circle = Circle;