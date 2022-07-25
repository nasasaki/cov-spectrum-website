// WARNING These values are used in URLs - be careful when changing them

export enum SamplingStrategy {
  AllSamples = 'AllSamples',
  AirportQuarantine = 'AirportQuarantine',
  DomesticSamples = 'DomesticSamples'
}

export function decodeSamplingStrategy(encoded: string): SamplingStrategy | null {
  if (!Object.values(SamplingStrategy).includes(encoded as any)) {
    return null;
  }
  return SamplingStrategy[encoded as keyof typeof SamplingStrategy];
}

export function addSamplingStrategyToUrlSearchParams(
  samplingStrategy: SamplingStrategy,
  params: URLSearchParams
) {
  if (samplingStrategy === SamplingStrategy.AllSamples) {
    return;
  }
  if (samplingStrategy === SamplingStrategy.AirportQuarantine) {
    params.set('samplingStrategy', 'Airport');
  }
  if (samplingStrategy === SamplingStrategy.DomesticSamples) {
    params.set('samplingStrategy', 'Domestic');
  }
}
