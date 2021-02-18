import React, { useEffect, useState } from 'react';
import { DistributionType, getVariantDistributionData } from '../services/api';
import { AgeDistributionEntry } from '../services/api-types';
import { Plot } from '../components/Plot';
import { sampleSelectorEncoder } from '../helpers/sample-selector';
import { Widget } from './Widget';

const propsEncoder = sampleSelectorEncoder;
type Props = typeof propsEncoder['_decodedType'];

const VariantAgeDistributionPlot = ({ country, mutations, matchPercentage }: Props) => {
  const [distributionData, setDistributionData] = useState<AgeDistributionEntry[] | undefined>(undefined);

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();
    const signal = controller.signal;
    getVariantDistributionData(DistributionType.Age, country, mutations, matchPercentage, signal)
      .then(newDistributionData => {
        if (isSubscribed) {
          setDistributionData(newDistributionData);
        }
      })
      .catch(e => {
        console.log('Called fetch data error', e);
      });
    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [country, mutations, matchPercentage]);

  return (
    <div style={{ height: '100%' }}>
      {distributionData !== undefined && (
        <Plot
          style={{ width: '100%', height: '100%' }}
          data={[
            {
              name: 'Sequences',
              type: 'bar',
              x: distributionData.map(d => d.x),
              y: distributionData.map(d => d.y.count),
            },
            {
              x: distributionData.map(d => d.x),
              y: distributionData.map(d => d.y.proportion.value * 100),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
              yaxis: 'y2',
              hovertemplate: '%{y:.2f}%<extra></extra>',
            },
          ]}
          layout={{
            title: 'Age Distribution',
            xaxis: {
              title: 'Age',
            },
            yaxis: {
              title: 'Number Sequences',
            },
            yaxis2: {
              title: 'Estimated Percentage',
              overlaying: 'y',
              side: 'right',
            },
            showlegend: false,
          }}
          config={{
            displaylogo: false,
            modeBarButtons: [['zoom2d', 'toImage', 'resetScale2d', 'pan2d']],
            responsive: true,
          }}
        />
      )}
    </div>
  );
};

export const VariantAgeDistributionPlotWidget = new Widget(
  propsEncoder,
  VariantAgeDistributionPlot,
  'variant_age-distribution'
);
