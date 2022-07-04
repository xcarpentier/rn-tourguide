import { StyleSheet } from 'react-native';
export const Z_INDEX = 100;
export const MARGIN = 13;
export const OFFSET_WIDTH = 4;
export default StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: Z_INDEX,
    },
    tooltip: {
        position: 'absolute',
        paddingHorizontal: 15,
        overflow: 'hidden',
        width: '100%',
        borderRadius: 16,
        paddingTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 16,
        zIndex: Z_INDEX - 1,
    },
    nonInteractionPlaceholder: {
        backgroundColor: 'transparent',
        zIndex: Z_INDEX - 2,
    },
    tooltipText: {
        textAlign: 'center',
    },
    tooltipContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '80%',
    },
    button: {
        padding: 10,
    },
    buttonText: {
        color: '#27ae60',
    },
    bottomBar: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    overlayContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },
});
