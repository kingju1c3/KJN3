import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50'
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: 'gray.200'
          },
          td: {
            borderColor: 'gray.200'
          }
        }
      }
    }
  }
});