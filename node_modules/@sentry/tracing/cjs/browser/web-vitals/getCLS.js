Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const bindReporter = require('./lib/bindReporter.js');
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

// https://wicg.github.io/layout-instability/#sec-layout-shift

const getCLS = (onReport, reportAllChanges) => {
  const metric = initMetric.initMetric('CLS', 0);
  let report;

  let sessionValue = 0;
  let sessionEntries = [];

  const entryHandler = (entry) => {
    // Only count layout shifts without recent user input.
    // TODO: Figure out why entry can be undefined
    if (entry && !entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.
      if (
        sessionValue &&
        sessionEntries.length !== 0 &&
        entry.startTime - lastSessionEntry.startTime < 1000 &&
        entry.startTime - firstSessionEntry.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.
      if (sessionValue > metric.value) {
        metric.value = sessionValue;
        metric.entries = sessionEntries;
        if (report) {
          report();
        }
      }
    }
  };

  const po = observe.observe('layout-shift', entryHandler );
  if (po) {
    report = bindReporter.bindReporter(onReport, metric, reportAllChanges);

    onHidden.onHidden(() => {
      po.takeRecords().map(entryHandler );
      report(true);
    });
  }
};

exports.getCLS = getCLS;
//# sourceMappingURL=getCLS.js.map
