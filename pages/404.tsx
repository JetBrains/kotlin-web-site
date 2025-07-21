import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { Layout } from '../components/layout';
import { NotFoundContent } from '../blocks/404';

function NotFoundPage() {
    return (
        <Layout
            title={'Page Not Found - Kotlin Programming Language'}
            description={
                'Kotlin is a concise and multiplatform programming language by JetBrains. Enjoy coding and build server-side, mobile, web, and desktop applications efficiently.'
            }
        >
            <NotFoundContent />
        </Layout>
    );
}

export default NotFoundPage;
