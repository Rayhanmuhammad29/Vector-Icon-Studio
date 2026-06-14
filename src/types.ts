import React from 'react';

export type LineCapType = 'round' | 'butt' | 'square';
export type LineJoinType = 'round' | 'bevel' | 'miter';

export interface StrokeConfig {
  primaryColor: string;
  secondaryColor: string; // for secondary elements or high-contrast subtle fills
  secondaryOpacity: number; // 0 to 1 (fill opacity)
  strokeWidth: number; // 1.5 to 4.5
  lineCap: LineCapType;
  lineJoin: LineJoinType;
  showGuidelines: boolean;
  guideColor: string;
  backgroundColor: 'transparent' | 'white' | 'dark';
}

export interface IconDefinition {
  id: string;
  title: string;
  concept: string;
  description: string;
  // A function that returns standard clean react-svg child elements
  // designed on a 100x100 viewBox
  render: (config: StrokeConfig) => React.ReactNode;
  isAiGenerated?: boolean;
  elements?: any[];
}
