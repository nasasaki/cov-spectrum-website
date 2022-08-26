import { Widget } from '../../widgets/Widget';
import { AsyncZodQueryEncoder } from '../../helpers/query-encoder';
import { Althaus2021GrowthContainer, ContainerProps } from './Althaus2021GrowthContainer';
import {
  decodeLocationDateVariantSelector,
  encodeLocationDateVariantSelector,
  LocationDateVariantSelectorEncodedSchema,
} from '../../data/LocationDateVariantSelector';
import { DateCountSampleData } from '../../data/sample/DateCountSampleDataset';
import { addDefaultHostAndQc } from '../../data/HostAndQcSelector';

export const Althaus2021GrowthWidget = new Widget(
  new AsyncZodQueryEncoder(
    LocationDateVariantSelectorEncodedSchema,
    async (v: ContainerProps) => encodeLocationDateVariantSelector(v.variantDateCounts.selector),
    async (encoded, signal) => {
      const variantSelector = decodeLocationDateVariantSelector(encoded);
      const wholeSelector = {
        ...variantSelector,
        variant: undefined,
      };
      return {
        variantDateCounts: await DateCountSampleData.fromApi(addDefaultHostAndQc(variantSelector), signal),
        wholeDateCounts: await DateCountSampleData.fromApi(addDefaultHostAndQc(wholeSelector), signal),
      };
    }
  ),
  Althaus2021GrowthContainer,
  'Althaus2021GrowthModel'
);
