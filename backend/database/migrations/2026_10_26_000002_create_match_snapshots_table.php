<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracked_match_id')->constrained()->restrictOnDelete();
            $table->unsignedSmallInteger('minute')->nullable();
            $table->unsignedSmallInteger('home_score')->nullable();
            $table->unsignedSmallInteger('away_score')->nullable();
            $table->json('exact_score_odds')->nullable();
            $table->json('second_half_over_under_odds')->nullable();
            $table->json('statistics')->nullable();
            $table->timestamp('captured_at');
            $table->timestamps();

            $table->index(['tracked_match_id', 'captured_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_snapshots');
    }
};
