import * as React from 'react';
import { Text, SafeAreaView, StyleSheet} from 'react-native';


export function SettingsScreen() {

    const { container } = styles;

    return (
        <SafeAreaView style={container}>
            <Text>Settings Screen!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});