/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import * as Sentry from '@sentry/react-native';

class Section extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // super.componentDidMount();
    Sentry.init({ 
      dsn: 'https://c815a4494fbc4e9c845509f94fc5bf72@o4504098518925312.ingest.sentry.io/4504098529083392', 
      beforeSend(event) {
        console.log('lcc_____eventeventeventeventeventevent', event);
        return event;
      },
      // enableAppStartTracking: true,
      tracesSampler(samplingContext) {
        console.log('lcc_____samplingContext = ', samplingContext);
        return 1.0;
      }
    });
  }


  validateShoppingCartOnServer () {
    return {
      code : 0,
      list : ['1', '2', 'lcc']
    }
  }

  processAndValidateShoppingCart () {
    
  }

  test() {
    // console.log('lcc');
    // throw new Error("34567890- 2222222222222");
    
    const transaction = Sentry.startTransaction({ name: "lcc_ceshi_分步骤" });
    Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
    const result = this.validateShoppingCartOnServer();

    setTimeout(() => {
      const span = transaction.startChild({
        data: {
          result,
        },
        op: 'Lcc_task1',
        description: `Lcc_步骤1`,
      });
      this.processAndValidateShoppingCart(result);
      span.setStatus('ok');
      span.finish();

      setTimeout(() => {
        const span1 = transaction.startChild({
          data: {
            result,
          },
          op: 'Lcc_task2',
          description: `Lcc_步骤2`,
        });
        this.processAndValidateShoppingCart(result);
        span1.setStatus('ok');
        span1.finish();
        setTimeout(() => {
          const span3 = transaction.startChild({
            data: {
              result,
            },
            op: 'Lcc_task3',
            description: `Lcc_步骤3`,
          });
          this.processAndValidateShoppingCart(result);
          span3.setStatus('ok');
          span3.finish();
          
          transaction.finish();
        }, 500);
      }, 1000);
    }, 2000);
  }

  render() {
    const isDarkMode = false;
    const {title, children} = this.props;
    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity onPress={()=>{
          this.test();
        }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            {title}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </View>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // super.componentDidMount();
  }

  render() {
    const isDarkMode = false;

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default Sentry.wrap(App);
