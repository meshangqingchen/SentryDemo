Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const bindReporter = require('./lib/bindReporter.js');
const getVisibilityWatcher = require('./lib/getVisibilityWatcher.js');
const initMetric = require('./lib/initMetric.js');
const observe = require('./lib/observe.js');
const onHidden = require('./lib/onHidden.js');

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// https://wicg.github.io/largest-contentful-paint/#sec-largest-contentful-paint-interface

const reportedMetricIDs = {};

const getLCP = (onReport, reportAllChanges) => {
  const visibilityWatcher = getVisibilityWatcher.getVisibilityWatcher();
  const metric = initMetric.initMetric('LCP');
  let report;

  const entryHandler = (entry) => {
    // The startTime attribute returns the value of the renderTime if it is not 0,
    // and the value of the loadTime otherwise.
    const value = entry.startTime;

    // If the page was hidden prior to paint time of the entry,
    // ignore it and mark the metric as final, otherwise add the entry.
    if (value < visibilityWatcher.firstHiddenTime) {
      metric.value = value;
      metric.entries.push(entry);
    }

    if (report) {
      report();
    }
  };

  const po = observe.observe('largest-contentful-paint', entryHandler);

  if (po) {
    report = bindReporter.bindReporter(onReport, metric, reportAllChanges);

    const stopListening = () => {
      if (!reportedMetricIDs[metric.id]) {
        po.takeRecords().map(entryHandler );
        po.disconnect();
        reportedMetricIDs[metric.id] = true;
        report(true);
      }
    };

    // Stop listening after input. Note: while scrolling is an input that
    // stop LCP observation, it's unreliable since it can be programmatically
    // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75
    ['keydown', 'click'].forEach(type => {
      addEventListener(type, stopListening, { once: true, capture: true });
    });

    onHidden.onHidden(stopListening, true);
  }
};

exports.getLCP = getLCP;
//# sourceMappingURL=getLCP.js.map
