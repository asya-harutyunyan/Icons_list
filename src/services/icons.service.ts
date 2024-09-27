import $apiClient from '../axios';
import { Icon } from '../types';

export class IconService {
  static getAllIcons(): Promise<Icon[]> {
    return $apiClient.get(`/icons`);
  }

  static addIcon(icon: Icon) {
    return $apiClient.post('/icons', icon);
  }

  static updateIcon({ id, iconData }: { id: string; iconData: Icon }) {
    return $apiClient.patch(`/icons/${id}`, iconData);
  }

  static deleteIcon(id: string) {
    return $apiClient.delete(`/icons/${id}`);
  }
}
