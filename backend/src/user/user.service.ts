import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto, Provider } from '../DTO/register.dto';
import * as bcrypt from 'bcryptjs';

export interface SavePaymentSessionDto {
    userId: string;
    customerId: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: [
                { email },
                { username },
            ],
        });
    }

    async findByProviderAndProviderId(provider: Provider, providerId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { provider, providerId } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(registerDto: RegisterDto): Promise<User> {
        const user = this.userRepository.create(registerDto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async deleteAllUsers(): Promise<void> {
        await this.userRepository.delete({});
        console.log('All users have been deleted.');
    }

    async enableTwoFactor(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
        if (user.isTwoFactorEnabled) {
            return user;
        }
        user.isTwoFactorEnabled = true;
        return this.userRepository.save(user);
    }

    async disableTwoFactor(
        userId: number,
        password: string,
    ): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException(`User ${userId} not found`);

        if (!user.password) {
            throw new UnauthorizedException('No local password set');
        }

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) {
            throw new UnauthorizedException('Incorrect password');
        }

        if (!user.isTwoFactorEnabled) {
            return user;
        }

        user.isTwoFactorEnabled = false;
        return this.userRepository.save(user);
    }

    async updatePassword(userId: number, hashed: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        user.password = hashed;
        await this.userRepository.save(user);
    }
}