import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen, HomeScreen, SignInScreen, RegisterScreen, SettingsScreen, DetailScreen } from './src';
import { AuthContext } from './src/utils';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';

const StackHome = createStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Main">
      <StackHome.Screen name="Main" component={HomeScreen} />
      <StackHome.Screen name="Detail" component={DetailScreen} />
    </StackHome.Navigator>
  );
}

const StackSettings = createStackNavigator();

function SettingsStack() {
  return (
    <StackSettings.Navigator initialRouteName="Settings">
      <StackSettings.Screen name="Settings" component={SettingsScreen} />
      <StackSettings.Screen name="Detail" component={DetailScreen} />
    </StackSettings.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

const StackAuth = createStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn">
      <StackAuth.Screen name="SignIn" component={SignInScreen} />
      <StackAuth.Screen name="Register" component={RegisterScreen} />
    </StackAuth.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token); //gravando o token obtido no banco de dados
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.removeItem('userToken'); //removendo o token do banco
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken }); //Busca o para ver se o existe o token no banco assim que a tela é carregada
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        console.log("SignIn data", data);

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );


  /*
    *O contexto foi criado com o valor padrão em utils.js,
    *Então esse componente possui a prop value que fiz do que o contexto será composto
    *No caso foi passado o valor do Hook useMemo, que memoisou algmas funções e não possui um valor de dependencias em seu array
    *Isso indica que não há um valor que fique gravado e a cada nova renderização a função passado tem que ser re-calculada

    *A função do use memo retorna um objeto com 3 funções que são passadas para os botões.
    *Quando uma função é executada nessas ações dos botões, muda o valor da variável 'dispatch' que é um das dependencias do useReucer
    *O useReducer receber como segundo pametro o estado inicial, e como primeiro parametro a função que deverá ser executada com base no último estado que ela armazenou
    *(geralmente usado quandoa  mudança de estado envolve muitas condições)


    *if 'isLoading = true' vai mostrar a SplashScreen
    *if 'isLoading = false e userToken = null' vai mostrar a SignInScreen
    *if 'isLoading = false e userToken != null' vai mostrar a HomeScreen
  */
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={AuthStack}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
                // User is signed in
                <Stack.Screen name="Home" component={HomeTab} />
              )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}