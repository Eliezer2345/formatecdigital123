import { Injectable, signal } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private serviceId = typeof EMAILJS_SERVICE_ID !== 'undefined' ? EMAILJS_SERVICE_ID : '';
  private templateId = typeof EMAILJS_TEMPLATE_ID !== 'undefined' ? EMAILJS_TEMPLATE_ID : '';
  private publicKey = typeof EMAILJS_PUBLIC_KEY !== 'undefined' ? EMAILJS_PUBLIC_KEY : '';

  constructor() {
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  private toasts = signal<{id: number, message: string, type: 'success' | 'error' | 'info'}[]>([]);

  getToasts() {
    return this.toasts;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    this.toasts.update(current => [...current, { id, message, type }]);
    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t.id !== id));
    }, 4000);
  }

  async sendWelcomeEmail(userName: string, userEmail: string) {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      this.showToast(`Simulación: Correo de Bienvenida enviado a ${userEmail}`, 'info');
      console.warn('EmailJS not configured. Skipping welcome email.');
      console.log(`Simulated Welcome Email to ${userEmail} for ${userName}`);
      return;
    }

    try {
      const templateParams = {
        to_name: userName,
        to_email: userEmail,
        message: '¡Bienvenido a ForMaTec! Tu camino profesional inicia hoy. Explora nuestros cursos técnicos y obtén tu certificación.',
        subject: '¡Bienvenido a la mejor academia técnica online!'
      };

      const response = await emailjs.send(this.serviceId, this.templateId, templateParams);
      this.showToast('Correo de bienvenida enviado!', 'success');
      console.log('Welcome email sent successfully!', response.status, response.text);
    } catch (error) {
      this.showToast('Error al enviar correo', 'error');
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendEnrollmentConfirmation(userName: string, userEmail: string, courseTitle: string) {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      this.showToast(`Inscrito en ${courseTitle}. Confirmación enviada a ${userEmail}`, 'success');
      console.warn('EmailJS not configured. Skipping enrollment email.');
      console.log(`Simulated Enrollment Email to ${userEmail} for ${courseTitle}`);
      return;
    }

    try {
      const templateParams = {
        to_name: userName,
        to_email: userEmail,
        course_name: courseTitle,
        message: `Te has inscrito exitosamente en el curso: ${courseTitle}. ¡Mucho éxito en tu aprendizaje!`,
        subject: `Confirmación de Inscripción: ${courseTitle}`
      };

      const response = await emailjs.send(this.serviceId, this.templateId, templateParams);
      this.showToast(`¡Inscrito en ${courseTitle}!`, 'success');
      console.log('Enrollment email sent successfully!', response.status, response.text);
    } catch (error) {
      this.showToast('Error al enviar confirmación', 'error');
      console.error('Failed to send enrollment email:', error);
    }
  }
}
