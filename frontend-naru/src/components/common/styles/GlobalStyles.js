import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const breakPoints = {
    mobile: "screen and (max-width:767px)",
    tablet: "screen and (min-width:768px) and (max-width:1023px)",
  };

export const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
        box-sizing: border-box;
        margin : 0;
        padding : 0;
    }

    html {
        font-size : 16px;

        @media ${breakPoints.tablet} {
            font-size: 14px;
          }
          @media ${breakPoints.mobile} {
            font-size: 12px;
          }
    }

    body {
        font-family: 'SUIT-Medium', '맑은 고딕', 'sans-serif';
        // overflow-x: hidden;
    }

    a {
        text-decoration: none;
        color: #000000;
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

    h1 {
        font-size: 2rem;
    }

    strong {
        font-family: 'SUIT-Bold';
    }


    @font-face {
        font-family: Jalnan;
        src : local('여기어때 잘난체'),
            url('/fonts/Jalnan.woff') format('woff')
    }

    @font-face {
        font-family: SUIT-Light;
        src : local('SUIT Light'),
            url('/fonts/SUIT-Light.woff2') format('woff2')
    }

    @font-face {
        font-family: SUIT-Medium;
        src : local('SUIT Medium'),
            url('/fonts/SUIT-Medium.woff2') format('woff2')
    }

    @font-face {
        font-family: SUIT-Bold;
        src : local('SUIT Bold'),
            url('/fonts/SUIT-Bold.woff2') format('woff2')
    }
`;
