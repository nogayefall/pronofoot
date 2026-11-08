<?php

namespace App\Rules;

enum RuleVerdict: string
{
    case Candidate = 'candidate';
    case NoSignal = 'no_signal';
    case Abstain = 'abstain';
    case NotDefined = 'not_defined';
}
