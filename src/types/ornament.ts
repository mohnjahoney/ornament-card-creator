import type { ConnectorPattern } from '@/config/cardLayout';

export interface ImageState {
  file: File | null;
  dataUrl: string | null;
  naturalWidth: number;
  naturalHeight: number;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface DesignOptions {
  bgColor: string;
  outlineColor: string;
  capColor: string;
  pattern: ConnectorPattern;
  textTemplateId: string;
}

export const DEFAULT_IMAGE_STATE: ImageState = {
  file: null,
  dataUrl: null,
  naturalWidth: 0,
  naturalHeight: 0,
  scale: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
};

export const DEFAULT_DESIGN_OPTIONS: DesignOptions = {
  bgColor: '#ffffff',
  outlineColor: '#b91c1c',
  capColor: '#fbbf24',
  pattern: 'solid',
  textTemplateId: 'merry',
};
