import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClinicsRepository } from '../clinics/clinics.repository';
import * as bcrypt from 'bcryptjs';
import { type LoginInput } from '@praxis/core/domain';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ClinicsRepository)
    private readonly clinicsRepository: ClinicsRepository,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async validateClinic(data: LoginInput) {
    const clinic = await this.clinicsRepository.findByEmail(data.email);

    if (clinic && (await bcrypt.compare(data.password, clinic.password))) {
      const { password, ...result } = clinic;
      return result;
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(clinic: any) {
    const payload = { 
      sub: clinic.id, 
      email: clinic.email 
    };

    return {
      access_token: this.jwtService.sign(payload),
      clinic: {
        id: clinic.id,
        name: clinic.name,
      }
    };
  }
}