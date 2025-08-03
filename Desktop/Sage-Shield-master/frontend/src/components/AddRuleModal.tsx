import React, { useState } from 'react';

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRule: (rule: Omit<SecurityRule, 'id'>) => void;
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  type: 'BLOCK' | 'ALERT';
  condition: string;
  enabled: boolean;
}

export default function AddRuleModal({ isOpen, onClose, onAddRule }: AddRuleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'BLOCK' | 'ALERT'>('BLOCK');
  const [condition, setCondition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRule({ name, description, type, condition, enabled: true });
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setType('BLOCK');
    setCondition('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New Security Rule</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" rows={3} required></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as 'BLOCK' | 'ALERT')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200">
              <option value="BLOCK">Block</option>
              <option value="ALERT">Alert</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
            <input type="text" id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 font-mono" placeholder="e.g., requests_per_minute > 1000" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Add Rule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
