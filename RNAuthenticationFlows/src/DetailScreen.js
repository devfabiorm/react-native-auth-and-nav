import * as React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';

export function DetailScreen() {
    const { container } = styles;

    return (
        <SafeAreaView style={container}>
            <Text>Home Screen!</Text>
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