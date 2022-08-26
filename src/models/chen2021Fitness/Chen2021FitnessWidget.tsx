import { AsyncZodQueryEncoder } from '../../helpers/query-encoder';
import { Widget } from '../../widgets/Widget';
import { Chen2021FitnessContainer, ContainerProps } from './Chen2021FitnessContainer';
import {
  decodeLocationDateVariantSelector,
  encodeLocationDateVariantSelector,
  LocationDateVariantSelectorEncodedSchema,
} from '../../data/LocationDateVariantSelector';
import { addDefaultHostAndQc } from '../../data/HostAndQcSelector';

export const Chen2021FitnessWidget = new Widget(
  new AsyncZodQueryEncoder(
    LocationDateVariantSelectorEncodedSchema,
    async (v: ContainerProps) => encodeLocationDateVariantSelector(v.selector),
    async encoded => {
      return { selector: addDefaultHostAndQc(decodeLocationDateVariantSelector(encoded)) };
    }
  ),
  Chen2021FitnessContainer,
  'Chen2021FitnessModel'
);
