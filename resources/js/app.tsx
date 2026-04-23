import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { ConfirmProvider } from './components/ui/confirm-provider';
import { Toaster } from './components/ui/sonner';
import { initializeTheme } from './hooks/use-appearance';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const appName = import.meta.env.VITE_APP_NAME || 'Ndoto Company Limited';
NProgress.configure({
  showSpinner: false,
});

router.on('start', () => NProgress.start());
router.on('finish', () => NProgress.done());
router.on('error', () => NProgress.done());

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ConfirmProvider>
                    <Toaster />
                    <App {...props} />
                </ConfirmProvider>
            </StrictMode>,
        );
    },
});

initializeTheme();
