
export const REPORT_PDF_URL = '/assets/state-of-kotlin-2026.pdf' as const;

export const REPORT_SECTION_URLS = {
    growth: `${REPORT_PDF_URL}#nameddest=adoption-curve`,
    organizations: `${REPORT_PDF_URL}#nameddest=enterprise-adoption`,
    backend: `${REPORT_PDF_URL}#nameddest=backend-kotlin`,
    multiplatform: `${REPORT_PDF_URL}#nameddest=kotlin-multiplatform`,
    ai: `${REPORT_PDF_URL}#nameddest=kotlin-and-ai`,
} as const;

export const MULTIPLATFORM_URL = '/multiplatform/' as const;
