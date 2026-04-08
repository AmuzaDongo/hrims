<?php

namespace App\Enums;

enum ParticipantRole: string
{
    case PARTICIPANT = 'participant';
    case ASSESSOR = 'assessor';
    case SCOUT = 'scout';
    case JUDGE = 'Support staff';
    case COORDINATOR = 'coordinator';
    case GUEST = 'guest';
}
