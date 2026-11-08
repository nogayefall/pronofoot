<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opportunity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracked_match_id')->constrained()->restrictOnDelete();
            $table->foreignId('match_snapshot_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('rule_profile_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type');
            $table->string('decision');
            $table->json('rule_results')->nullable();
            $table->json('filter_results')->nullable();
            $table->text('suggested_action')->nullable();
            $table->text('reason')->nullable();
            $table->string('outcome')->nullable();
            $table->timestamp('evaluated_at');
            $table->timestamps();

            $table->index(['tracked_match_id', 'evaluated_at']);
            $table->index(['event_type', 'decision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunity_logs');
    }
};
