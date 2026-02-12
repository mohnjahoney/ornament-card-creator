import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import {
  DEFAULT_DESIGN_OPTIONS,
  DEFAULT_IMAGE_STATE,
  type DesignOptions,
  type ImageState,
} from '@/types/ornament';

export interface WizardState {
  currentStep: number; // 0=splash, 1-4=image, 5=design, 6=preview
  images: [ImageState, ImageState, ImageState, ImageState];
  design: DesignOptions;
}

export type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_IMAGE'; index: number; data: Partial<ImageState> }
  | { type: 'DELETE_IMAGE'; index: number }
  | { type: 'SET_DESIGN'; data: Partial<DesignOptions> };

const initialState: WizardState = {
  currentStep: 0,
  images: [
    { ...DEFAULT_IMAGE_STATE },
    { ...DEFAULT_IMAGE_STATE },
    { ...DEFAULT_IMAGE_STATE },
    { ...DEFAULT_IMAGE_STATE },
  ],
  design: { ...DEFAULT_DESIGN_OPTIONS },
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_IMAGE': {
      const images = [...state.images] as WizardState['images'];
      images[action.index] = { ...images[action.index], ...action.data };
      return { ...state, images };
    }
    case 'DELETE_IMAGE': {
      const images = [...state.images] as WizardState['images'];
      images[action.index] = { ...DEFAULT_IMAGE_STATE };
      return { ...state, images };
    }
    case 'SET_DESIGN':
      return { ...state, design: { ...state.design, ...action.data } };
    default:
      return state;
  }
}

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
} | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}
