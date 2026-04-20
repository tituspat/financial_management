'use client';

import { useFinance } from '@/lib/finance-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardBody, Section } from '@/components/cards';
import { Button, Input, Select } from '@/components/ui/index';

const EMOJI_OPTIONS = [
  '☕', '🚗', '🛒', '🎬', '💡', '🍽️', '🏠', '📚', '💊', '👕',
  '✈️', '🎮', '🎵', '📱', '💄', '🐕', '🍕', '🏋️', '🎪', '🌳',
];

const COLOR_OPTIONS = [
  '#8B4513', '#FF6B6B', '#51CF66', '#FFD93D', '#A8E6CF',
  '#FF6B9D', '#00B894', '#0984E3', '#FDCB6E', '#6C5CE7',
  '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#74B9FF',
];

export default function Settings() {
  const router = useRouter();
  const { categories, addCategory, deleteCategory, renameCategory, addSubCategory, deleteSubCategory, renameSubCategory } = useFinance();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('🏷️');
  const [newCategoryColor, setNewCategoryColor] = useState('#6C5CE7');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [newSubCategoryEmoji, setNewSubCategoryEmoji] = useState('📌');
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName, activeTab, newCategoryEmoji, newCategoryColor);
    setNewCategoryName('');
    setNewCategoryEmoji('🏷️');
    setNewCategoryColor('#6C5CE7');
  };

  const handleAddSubCategory = (categoryId: string) => {
    if (!newSubCategoryName.trim()) return;
    addSubCategory(categoryId, newSubCategoryName, newSubCategoryEmoji);
    setNewSubCategoryName('');
    setNewSubCategoryEmoji('📌');
    setExpandedSubCategory(null);
  };

  const handleRenameCategory = (categoryId: string) => {
    if (!editingCategoryName.trim()) return;
    renameCategory(categoryId, editingCategoryName);
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Delete this category? All transactions using it will remain but show no category.')) {
      deleteCategory(categoryId);
    }
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    if (confirm('Delete this sub-category?')) {
      deleteSubCategory(categoryId, subCategoryId);
    }
  };

  const handleRenameSubCategory = (categoryId: string, subCategoryId: string, newName: string) => {
    if (!newName.trim()) return;
    renameSubCategory(categoryId, subCategoryId, newName);
    setExpandedSubCategory(null);
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Settings"
        subtitle="Customize your categories and preferences"
      />

      {/* Tabs */}
      <div className="px-6 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'expense'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            💸 Expenses
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'income'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            💵 Income
          </button>
        </div>
      </div>

      <div className="px-6 space-y-5 pb-8">
        {/* Add New Category */}
        <Section title="Add New Category">
          <div className="space-y-3">
            <Input
              label="Category Name"
              placeholder="e.g., Healthcare"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-2">
                  Emoji
                </label>
                <select
                  value={newCategoryEmoji}
                  onChange={(e) => setNewCategoryEmoji(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-lg"
                >
                  {EMOJI_OPTIONS.map((emoji) => (
                    <option key={emoji} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-2">
                  Color
                </label>
                <select
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50"
                >
                  {COLOR_OPTIONS.map((color) => (
                    <option key={color} value={color}>
                      <div
                        className="w-4 h-4 rounded-full inline-block mr-2"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="primary" fullWidth onClick={handleAddCategory}>
              Add Category
            </Button>
          </div>
        </Section>

        {/* Categories List */}
        <Section title={activeTab === 'expense' ? 'Expense Categories' : 'Income Categories'}>
          <div className="space-y-2">
            {filteredCategories.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6">
                No {activeTab} categories yet
              </p>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition cursor-pointer"
                    onClick={() =>
                      setExpandedCategory(expandedCategory === category.id ? null : category.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{category.emoji}</span>
                        {editingCategoryId === category.id ? (
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            onBlur={() => handleRenameCategory(category.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameCategory(category.id);
                              if (e.key === 'Escape') setEditingCategoryId(null);
                            }}
                            autoFocus
                            className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {category.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {category.subCategories?.length || 0} sub-categories
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategoryId(category.id);
                            setEditingCategoryName(category.name);
                          }}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-400"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Categories */}
                  {expandedCategory === category.id && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/20 space-y-3">
                      {/* Add Sub-Category */}
                      {expandedSubCategory !== `add-${category.id}` ? (
                        <button
                          onClick={() => setExpandedSubCategory(`add-${category.id}`)}
                          className="w-full p-2 text-center text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition"
                        >
                          + Add Sub-Category
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <Input
                            placeholder="Sub-category name"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            size="sm"
                          />
                          <div className="flex gap-2">
                            <select
                              value={newSubCategoryEmoji}
                              onChange={(e) => setNewSubCategoryEmoji(e.target.value)}
                              className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white"
                            >
                              {EMOJI_OPTIONS.map((emoji) => (
                                <option key={emoji} value={emoji}>
                                  {emoji}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAddSubCategory(category.id)}
                              className="px-3 py-2 bg-indigo-600 text-white rounded font-medium text-sm hover:bg-indigo-700"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setExpandedSubCategory(null);
                                setNewSubCategoryName('');
                                setNewSubCategoryEmoji('📌');
                              }}
                              className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded font-medium text-sm hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Sub-Categories List */}
                      {category.subCategories && category.subCategories.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {category.subCategories.map((subCat) => (
                            <div
                              key={subCat.id}
                              className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span>{subCat.emoji || '📌'}</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {subCat.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteSubCategory(category.id, subCat.id)
                                }
                                className="text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
