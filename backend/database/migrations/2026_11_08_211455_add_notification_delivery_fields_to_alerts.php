<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->boolean('fallback_used')->default(false)->after('sent_at');
            $table->text('failure_reason')->nullable()->after('fallback_used');
        });
    }

    public function down(): void
    {
        Schema::table('alerts', function (Blueprint $table) {
            $table->dropColumn(['fallback_used', 'failure_reason']);
        });
    }
};
