/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CloudService {
  id: 'iaas' | 'paas' | 'saas';
  name: string;
  fullName: string;
  description: string;
  analogy: string;
  analogyTitle: string;
  managedByProvider: string[];
  managedByUser: string[];
  examples: Array<{ name: string; desc: string; iconName: string }>;
  bestFor: string;
}

export interface ArchitectureComponent {
  id: string;
  type: 'client' | 'cdn' | 'dns' | 'loadbalancer' | 'webserver' | 'database' | 'storage';
  name: string;
  description: string;
  iconName: string;
  status: 'active' | 'inactive';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface DeploymentModel {
  id: 'public' | 'private' | 'hybrid' | 'multicloud';
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  securityLevel: 'High' | 'Medium' | 'Low' | 'Flexible';
  costLevel: 'Lower' | 'Higher' | 'Variable' | 'Highest';
  suitability: string;
}
