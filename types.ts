import React from 'react';

export enum Sender {
  User = 'user',
  Bot = 'bot',
  System = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  imageUrl?: string;
  sources?: Array<{
    uri: string;
    title: string;
  }>;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}