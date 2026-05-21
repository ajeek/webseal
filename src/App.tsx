/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
