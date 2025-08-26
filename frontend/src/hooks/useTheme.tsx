import React, {useContext} from 'react';
import {ITheme} from '../constants/types';

export const ThemeContext = React.createContext<ITheme>({} as ITheme);

export const ThemeProvider = ({
                                  children,
                                  theme,
                                  setTheme
                              }: {
    children: React.ReactNode,
    theme: ITheme,
    setTheme?: (theme?: ITheme) => void
}) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;

export default () => useContext(ThemeContext);
