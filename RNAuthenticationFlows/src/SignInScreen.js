import * as React from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { AuthContext } from './utils';

export function SignInScreen({ navigation }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { signIn } = React.useContext(AuthContext); 
    //Clica no botão com a função sinIn para chamar o useContext, 
    //que recebe o contexto criado em utils.js
    //Depois usar o useMemo para memorizar os Dados
    //Depois usar o useReducer na mudança de estado e no dado para salvar
    //Na Stack verifica o estado
    const { container, txtInput} = styles;

    return (
        <View style={container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={txtInput}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={txtInput}
            />
            <Button title="Sign in" onPress={() => signIn({ username, password })} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtInput: {
        height: 50,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5
    }
});