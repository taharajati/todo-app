import React from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdCheck } from 'react-icons/md';

const themes = {
  default: {
    name: 'Default',
    primary: 'blue',
    accent: 'indigo'
  },
  sunset: {
    name: 'Sunset',
    primary: 'orange',
    accent: 'red'
  },
  forest: {
    name: 'Forest',
    primary: 'green',
    accent: 'emerald'
  },
  ocean: {
    name: 'Ocean',
    primary: 'cyan',
    accent: 'teal'
  },
  lavender: {
    name: 'Lavender',
    primary: 'purple',
    accent: 'violet'
  }
};

const layouts = {
  grid: 'Grid',
  list: 'List',
  compact: 'Compact'
};

const fonts = {
  system: {
    name: 'System Default',
    family: 'system-ui, -apple-system, sans-serif'
  },
  vazir: {
    name: 'Vazir',
    family: 'Vazir, system-ui'
  },
  yekan: {
    name: 'Yekan',
    family: 'Yekan, system-ui'
  },
  sahel: {
    name: 'Sahel',
    family: 'Sahel, system-ui'
  }
};

const fontSizes = {
  sm: {
    name: 'Small',
    size: '0.875rem'
  },
  md: {
    name: 'Medium',
    size: '1rem'
  },
  lg: {
    name: 'Large',
    size: '1.125rem'
  },
  xl: {
    name: 'Extra Large',
    size: '1.25rem'
  }
};

function Settings({ isOpen, onClose, settings, onUpdateSettings }) {
  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">شخصی‌سازی</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تم رنگی</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => updateSetting('theme', key)}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  settings.theme === key
                    ? `bg-${theme.primary}-100 text-${theme.primary}-800 dark:bg-${theme.primary}-900 dark:text-${theme.primary}-200`
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {theme.name}
                {settings.theme === key && <MdCheck className="text-xl" />}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">نوع نمایش</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(layouts).map(([key, name]) => (
              <button
                key={key}
                onClick={() => updateSetting('layout', key)}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  settings.layout === key
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {name}
                {settings.layout === key && <MdCheck className="text-xl" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">فونت</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(fonts).map(([key, font]) => (
              <button
                key={key}
                onClick={() => updateSetting('font', key)}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  settings.font === key
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
                style={{ fontFamily: font.family }}
              >
                {font.name}
                {settings.font === key && <MdCheck className="text-xl" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اندازه متن</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(fontSizes).map(([key, size]) => (
              <button
                key={key}
                onClick={() => updateSetting('fontSize', key)}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  settings.fontSize === key
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
                style={{ fontSize: size.size }}
              >
                {size.name}
                {settings.fontSize === key && <MdCheck className="text-xl" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { Settings, themes, layouts, fonts, fontSizes }; 