import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

// ============================================================================
// LANGUAGE TRANSLATIONS
// ============================================================================
export const LOCAL_STORAGE_KEY = "USER-SETTINGS"
export const languages = {
    en: {
        ADD_FILE_BTN_TEXT: "Add file",
        TEXT_INPUT_TEXT: "Ask for something...",
        ADD_AUDIO_BTN_TEXT: "Add Voice",
        WAIT_ANIMATION_TEXT: "Thinking",
        SEND_BUTTON: "Send",
        FILES_SELECTED: "{count} file(s)",
        VOICE_MESSAGE: "Voice Message",
        DURATION: "Duration",
        DOWNLOAD: "Download",
        CLEAR_ALL: "Clear All",
        ATTACHMENTS: "Attachments",
        PLAYING: "Playing",
        RECORDING:"Recording",
        PAUSED: "Paused",
        USER: "User",
        ASSISTANT: "Assistant",
        ASK_FOR_SOMETHING:"Ask for something...",
        NO_MESSAGES: "No messages yet",
        TYPE_HERE: "Type here...",
        UPLOADING: "Uploading...",
        UPLOAD_COMPLETE: "Upload complete",
        ERROR_UPLOAD: "Upload failed",
        MAX_FILES: "Maximum {count} files allowed",
        FILE_TOO_LARGE: "File too large. Max size: {size}MB",
        INVALID_FILE_TYPE: "Invalid file type",
        REMOVE_FILE: "Remove file",
        CANCEL: "Cancel",
        CONFIRM: "Confirm",
        DELETE_CONFIRM: "Delete this message?",
        EDIT: "Edit",
        REPLY: "Reply",
        FORWARD: "Forward",
        COPY: "Copy",
        COPIED: "Copied!",
        SEARCH: "Search messages...",
        TODAY: "Today",
        YESTERDAY: "Yesterday",
        NEW_MESSAGE: "New message"
    },
    es: {
        ADD_FILE_BTN_TEXT: "Añadir archivo",
        TEXT_INPUT_TEXT: "Pregunta algo...",
        ADD_AUDIO_BTN_TEXT: "Añadir Voz",
        WAIT_ANIMATION_TEXT: "Pensando",
        SEND_BUTTON: "Enviar",
        FILES_SELECTED: "{count} archivo(s)",
        VOICE_MESSAGE: "Mensaje de voz",
        DURATION: "Duración",
        DOWNLOAD: "Descargar",
        CLEAR_ALL: "Limpiar todo",
        ATTACHMENTS: "Adjuntos",
        PLAYING: "Reproduciendo",
        RECORDING:"Grabando",
        PAUSED: "Pausado",
        USER: "Usuario",
        ASSISTANT: "Asistente",
        ASK_FOR_SOMETHING:"Pregunta me algo...",
        NO_MESSAGES: "Aún no hay mensajes",
        TYPE_HERE: "Escribe aquí...",
        UPLOADING: "Subiendo...",
        UPLOAD_COMPLETE: "Subida completada",
        ERROR_UPLOAD: "Error al subir",
        MAX_FILES: "Máximo {count} archivos permitidos",
        FILE_TOO_LARGE: "Archivo muy grande. Tamaño máximo: {size}MB",
        INVALID_FILE_TYPE: "Tipo de archivo no válido",
        REMOVE_FILE: "Eliminar archivo",
        CANCEL: "Cancelar",
        CONFIRM: "Confirmar",
        DELETE_CONFIRM: "¿Eliminar este mensaje?",
        EDIT: "Editar",
        REPLY: "Responder",
        FORWARD: "Reenviar",
        COPY: "Copiar",
        COPIED: "¡Copiado!",
        SEARCH: "Buscar mensajes...",
        TODAY: "Hoy",
        YESTERDAY: "Ayer",
        NEW_MESSAGE: "Nuevo mensaje"
    }
};

// TypeScript types for translations
export type LanguageCode = keyof typeof languages;
export type TranslationKeys = keyof typeof languages.en;
export type Translations = typeof languages;

// Helper function to get translations with parameters
export function getTranslation(
  lang: LanguageCode, 
  key: TranslationKeys, 
  params?: Record<string, string | number>
): string {
  const translation = languages[lang][key];
  if (!params) return translation;

  return translation.replace(/\{(\w+)\}/g, (_, param) => 
    params[param]?.toString() || `{${param}}`
  );
}

// ============================================================================
// SETTINGS CONTEXT
// ============================================================================

// TypeScript interfaces
export interface Settings {
  theme: 'light' | 'dark';
  language: LanguageCode;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  notifications: boolean;
  autoScroll: boolean;
  compactMode: boolean;
  timeFormat: '12h' | '24h';
}

export interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  toggleSetting: (key: keyof Pick<Settings, 'soundEnabled' | 'notifications' | 'autoScroll' | 'compactMode'>) => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
  currentLanguage: typeof languages[LanguageCode];
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  language: 'en',
  fontSize: 'medium',
  soundEnabled: true,
  notifications: true,
  autoScroll: true,
  compactMode: false,
  timeFormat: '12h',
};

// Language options with display names (using existing languages)
export const LANGUAGE_OPTIONS = Object.keys(languages).map(code => ({
  value: code as LanguageCode,
  label: code === 'en' ? 'English' : 
         code === 'es' ? 'Spanish' : 
         code === 'fr' ? 'French' : 
         code === 'de' ? 'German' : 
         code === 'ja' ? 'Japanese' : 
         code === 'zh' ? 'Chinese' : code,
  nativeName: code === 'en' ? 'English' : 
              code === 'es' ? 'Español' : 
              code === 'fr' ? 'Français' : 
              code === 'de' ? 'Deutsch' : 
              code === 'ja' ? '日本語' : 
              code === 'zh' ? '中文' : code
}));

// Theme options
export const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Light Mode' },
  { value: 'dark' as const, label: 'Dark Mode' },
] as const;

// Font size options
export const FONT_SIZE_OPTIONS = [
  { value: 'small' as const, label: 'Small' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'large' as const, label: 'Large' },
] as const;

// Time format options
export const TIME_FORMAT_OPTIONS = [
  { value: '12h' as const, label: '12-hour' },
  { value: '24h' as const, label: '24-hour' },
] as const;

// Create the context with default values
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider props interface
interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: Partial<Settings>;
}

// Custom hook to use settings
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Helper hook for theme changes
export const useTheme = () => {
  const { settings, updateSetting } = useSettings();
  
  const toggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light');
  }, [settings.theme, updateSetting]);
  
  return {
    theme: settings.theme,
    toggleTheme,
    isDarkMode: settings.theme === 'dark',
  };
};

// Helper hook for language changes
export const useLanguage = () => {
  const { settings, updateSetting, t } = useSettings();
  
  const changeLanguage = useCallback((language: LanguageCode) => {
    updateSetting('language', language);
  }, [updateSetting]);
  
  return {
    language: settings.language,
    changeLanguage,
    t, // Translation function
    currentTranslations: languages[settings.language],
  };
};

// Provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ 
  children, 
  initialSettings = {} 
}) => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    return { ...DEFAULT_SETTINGS, ...initialSettings };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply language to document
    document.documentElement.lang = settings.language;
    
    // Apply font size
    document.documentElement.style.fontSize = 
      settings.fontSize === 'small' ? '14px' :
      settings.fontSize === 'large' ? '18px' : '16px';
      
  }, [settings]);

  // Translation function
  const t = useCallback((key: TranslationKeys, params?: Record<string, string | number>) => {
    return getTranslation(settings.language, key, params);
  }, [settings.language]);

  // Update single setting
  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K, 
    value: Settings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  // Toggle boolean settings
  const toggleSetting = useCallback((
    key: keyof Pick<Settings, 'soundEnabled' | 'notifications' | 'autoScroll' | 'compactMode'>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    toggleSetting,
    t,
    currentLanguage: languages[settings.language],
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Re-export translation utility functions
   
export default SettingsContext;