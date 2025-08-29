import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme, setTheme } from '../store/slices/themeSlice'

export const useTheme = () => {
  const theme = useSelector((state) => state.theme.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggle = () => {
    dispatch(toggleTheme())
  }

  const set = (newTheme) => {
    dispatch(setTheme(newTheme))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggle,
    set,
  }
}
