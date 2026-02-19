import React from 'react';
import { 
  useSettings, 
  useTheme, 
  useLanguage,
  LANGUAGE_OPTIONS, 
  THEME_OPTIONS,
  FONT_SIZE_OPTIONS,
  TIME_FORMAT_OPTIONS 
} from '../../context/SettingsContext';

const SettingsPanel: React.FC = () => {
  const { settings, updateSetting, toggleSetting, resetSettings } = useSettings();
  const { toggleTheme } = useTheme();
  const { changeLanguage } = useLanguage();

  return (
    <div className="settings-panel">
      <h2 className="settings-title">Settings</h2>
      
      {/* Theme Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        
        <div className="setting-item">
          <label className="setting-label">Theme</label>
          <div className="setting-options">
            {THEME_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`theme-option ${settings.theme === option.value ? 'active' : ''}`}
                onClick={() => updateSetting('theme', option.value)}
              >
                {option.label}
              </button>
            ))}
            <button 
              className="theme-toggle-button"
              onClick={toggleTheme}
            >
              Toggle Theme
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">Font Size</label>
          <select
            className="setting-select"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', e.target.value as any)}
          >
            {FONT_SIZE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Language & Region</h3>
        
        <div className="setting-item">
          <label className="setting-label">Language</label>
          <select
            className="setting-select"
            value={settings.language}
            onChange={(e) => changeLanguage(e.target.value as any)}
          >
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.nativeName})
              </option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label className="setting-label">Time Format</label>
          <div className="setting-options">
            {TIME_FORMAT_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`time-format-option ${settings.timeFormat === option.value ? 'active' : ''}`}
                onClick={() => updateSetting('timeFormat', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Preferences</h3>
        
        {[
          { key: 'soundEnabled' as const, label: 'Sound Effects' },
          { key: 'notifications' as const, label: 'Notifications' },
          { key: 'autoScroll' as const, label: 'Auto-scroll Messages' },
          { key: 'compactMode' as const, label: 'Compact Mode' },
        ].map(({ key, label }) => (
          <div key={key} className="setting-item toggle-item">
            <label className="toggle-label">
              <span className="toggle-text">{label}</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() => toggleSetting(key)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="settings-actions">
        <button 
          className="reset-button"
          onClick={resetSettings}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;