import { Widget } from './Widget';
import { AsyncZodQueryEncoder } from '../helpers/query-encoder';
import {
  decodeLocationDateVariantSelector,
  encodeLocationDateVariantSelector,
  LocationDateVariantSelectorEncodedSchema,
} from '../data/LocationDateVariantSelector';
import { EstimatedCasesChart, EstimatedCasesChartProps } from './EstimatedCasesChart';
import * as zod from 'zod';
import { DateCountSampleData } from '../data/sample/DateCountSampleDataset';
import { CaseCountAsyncDataset, CaseCountData } from '../data/CaseCountDataset';
import { AsyncStatusTypes } from '../data/AsyncDataset';
import { LocationDateSelector } from '../data/LocationDateSelector';
import { addDefaultHostAndQc } from '../data/HostAndQcSelector';

export const EstimatedCasesChartWidget = new Widget(
  new AsyncZodQueryEncoder(
    LocationDateVariantSelectorEncodedSchema,
    async (decoded: EstimatedCasesChartProps) =>
      encodeLocationDateVariantSelector(decoded.variantDateCounts.selector),
    async (encoded: zod.infer<typeof LocationDateVariantSelectorEncodedSchema>, signal) => {
      const variantSelector = decodeLocationDateVariantSelector(encoded);
      const wholeSelector = {
        ...variantSelector,
        variant: undefined,
      };
      const caseSelector: LocationDateSelector = {
        location: variantSelector.location,
        dateRange: variantSelector.dateRange,
      };
      return {
        variantDateCounts: await DateCountSampleData.fromApi(addDefaultHostAndQc(variantSelector), signal),
        wholeDateCounts: await DateCountSampleData.fromApi(addDefaultHostAndQc(wholeSelector), signal),
        caseCounts: {
          selector: caseSelector,
          payload: (await CaseCountData.fromApi(caseSelector, signal)).payload,
          status: AsyncStatusTypes.fulfilled,
        } as CaseCountAsyncDataset,
      };
    }
  ),
  EstimatedCasesChart,
  'EstimatedCasesChart'
);
