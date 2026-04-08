<?php

namespace App\Enums;

enum ParticipantStatus: string
{
    case INVITED = 'invited';
    case CONFIRMED = 'confirmed';
    case ATTENDED = 'attended';
    case CANCELLED = 'cancelled';
}
