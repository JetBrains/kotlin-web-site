import React from 'react';
import QuotesSlider from '@jetbrains/kotlin-web-site-ui/out/components/quotes-slider';
import { quotes } from './quotes';

export function TeachQuotes() {
  return (
    <QuotesSlider quotes={quotes} large />
  );
}