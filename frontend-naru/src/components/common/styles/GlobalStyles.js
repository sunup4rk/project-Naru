import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
        box-sizing: border-box;
        margin : 0;
        padding : 0;
    }

    html {
        font-size : 16px;
    }

    body {
        font-family: 'SUIT', '맑은 고딕', 'sans-serif';
        overflow-x: hidden;
    }

    ul {
        list-style: none;
    }

    li {
        list-style: none;
    }

    button {
        cursor: pointer;
    }


    @font-face {
        font-family: Jalnan;
        src : local('여기어때 잘난체'),
            url('fonts/Jalnan.woff') format('woff')
    }

    @font-face {
        font-family: SUIT-Light;
        src : local('SUIT Light'),
            url('fonts/SUIT-Light.woff2') format('woff2')
    }

    @font-face {
        font-family: SUIT-Medium;
        src : local('SUIT Medium'),
            url('fonts/SUIT-Medium.woff2') format('woff2')
    }

    @font-face {
        font-family: SUIT-Bold;
        src : local('SUIT Bold'),
            url('fonts/SUIT-Bold.woff2') format('woff2')
    }
`;
