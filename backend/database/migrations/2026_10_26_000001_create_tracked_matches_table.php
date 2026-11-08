<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracked_matches', function (Blueprint $table) {
            $table->id();
            $table->string('provider');
            $table->string('provider_match_id');
            $table->string('home_team');
            $table->string('away_team');
            $table->string('competition')->nullable();
            $table->timestamp('kickoff_at')->nullable();
            $table->string('status')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['provider', 'provider_match_id']);
            $table->index(['is_active', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracked_matches');
    }
};
