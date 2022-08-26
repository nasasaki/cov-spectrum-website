import { Dataset } from '../Dataset';
import { LocationDateVariantSelector } from '../LocationDateVariantSelector';
import { PangoCountSampleEntry } from './PangoCountSampleEntry';
import { fetchPangoLineageCountSamples } from '../api-lapis';
import { LapisSelector } from '../LapisSelector';

export type PangoCountSampleDataset = Dataset<LocationDateVariantSelector, PangoCountSampleEntry[]>;

export class PangoCountSampleData {
  static async fromApi(selector: LapisSelector, signal?: AbortSignal): Promise<PangoCountSampleDataset> {
    return { selector, payload: await fetchPangoLineageCountSamples(selector, signal) };
  }
}
