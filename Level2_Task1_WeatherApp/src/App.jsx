import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { SettingsProvider } from '@/context/SettingsContext';
import { WeatherProvider } from '@/context/WeatherContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Home from '@/pages/Home';
const queryClient = new QueryClient();
function App() {
    return (<ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <WeatherProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Switch>
              <Route path="/" component={Home}/>
              <Route>
                <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                  <h1 className="text-4xl font-bold">404 - Not Found</h1>
                </div>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </WeatherProvider>
      </SettingsProvider>
    </QueryClientProvider>
    </ErrorBoundary>);
}
export default App;
