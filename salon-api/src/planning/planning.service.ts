import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
  ) {}

  async getAgenda(personnelId: number, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.repo.find({
      where: {
        personnel: { id: personnelId },
        date_debut: Between(start, end),
      },
      order: {
        date_debut: 'ASC',
      },
    });
  }

  generateSlots(startHour = 8, endHour = 18, stepMinutes = 30) {
    const slots: string[] = [];

    const start = new Date();
    start.setHours(startHour, 0, 0, 0);

    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    while (start < end) {
      slots.push(start.toTimeString().slice(0, 5));
      start.setMinutes(start.getMinutes() + stepMinutes);
    }

    return slots;
  }

  async getAvailableSlots(
    personnelId: number,
    date: Date,
    durationMinutes: number,
  ) {
    const agenda = await this.getAgenda(personnelId, date);

    const slots = this.generateSlots();

    const occupied = agenda.map((r) => ({
      start: new Date(r.date_debut),
      end: new Date(r.date_fin_prevue),
    }));

    const available = slots.filter((slot) => {
      const slotTime = new Date(date);
      const [h, m] = slot.split(':');
      slotTime.setHours(+h, +m, 0, 0);

      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

      // check overlap
      return !occupied.some((o) => {
        return slotTime < o.end && slotEnd > o.start;
      });
    });

    return available;
  }
}
